import * as mitt from 'mitt'

declare enum DropZoneEvents {
  click = 'click',
  dragstart = 'dragstart',
  dragend = 'dragend',
  dragenter = 'dragenter',
  dragleave = 'dragleave',
  dragover = 'dragover',
  drop = 'drop',
  fileadded = 'fileadded',
}

interface DropZoneOptions {
  accept?: string
  clickable?: boolean
  dragClass?: string
  multiple?: boolean
}

interface DropZoneInstance {
  destroy (): void
  on(type: DropZoneEvents, handler: mitt.Handler): void;
  on(type: "*", handler: mitt.WildcardHandler): void;
  off(type: DropZoneEvents, handler: mitt.Handler): void;
  off(type: "*", handler: mitt.WildcardHandler): void;
}

export function createDataUri(file: File): Promise<string>
export function DropZone(element: Element, options?: DropZoneOptions): DropZoneInstance
