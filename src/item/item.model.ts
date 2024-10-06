export interface IItem {
  title: string;
  id: number;
  lvl: number;
  items: IItem[] | null;
}

export type ItemDragEvent = {
  baseEvent: DragEvent
  item: IItem
  parent: IItem | null
}
