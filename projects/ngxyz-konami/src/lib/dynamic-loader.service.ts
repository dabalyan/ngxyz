import {Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, ComponentRef} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DynamicComponentLoader {
  private componentRefs: Map<any, ComponentRef<any>> = new Map();
  private destroyTimeoutRef;

  constructor(private factoryResolver: ComponentFactoryResolver, private appRef: ApplicationRef, private injector: Injector) {
  }

  appendToBody(component: any, data: any) {
    clearTimeout(this.destroyTimeoutRef);

    const componentRef: ComponentRef<any> = this.factoryResolver.resolveComponentFactory(component).create(this.injector);
    Object.assign(componentRef.instance, data || {});
    this.appRef.attachView(componentRef.hostView);

    const componentNativeEl: HTMLElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(componentNativeEl);

    this.componentRefs.set(component, componentRef);
  }

  detachAndDestroy(component, timeout?: number) {
    clearTimeout(this.destroyTimeoutRef);

    if (timeout) {
      this.destroyTimeoutRef = setTimeout(() => {
        this.detachAndDestroy(component);
      }, timeout);
      return;
    }

    const componentRef = this.componentRefs.get(component);
    if (!componentRef) {
      return;
    }
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
    this.componentRefs.delete(component);
  }
}
