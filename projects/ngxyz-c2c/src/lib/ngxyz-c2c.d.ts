interface NgxyzC2cOptions {
  animation?: boolean;
  iconSize?: number;
  iconColor?: string;
}

interface NgxyzC2cIconGeometry {
  left: number;
  top: number;
  translateToTop?: number;
}

interface NgxyzC2cIconAndItsGeometry {
  icon: HTMLElement;
  iconGeometry: NgxyzC2cIconGeometry;
}
