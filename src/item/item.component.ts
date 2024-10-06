import {Component, EventEmitter, Input, Output} from "@angular/core";
import {IItem, ItemDragEvent} from "./item.model";
import getUID from "../helpers/getUID";

@Component({
  selector: "Item",
  templateUrl: "item.component.html",
  styleUrl: "item.component.css"
})
export class Item {
  @Input() onDragEnd!: (e: DragEvent) => void
  @Input() data!: IItem
  @Input() parent: IItem | null = null
  @Input() hoverPadding!: number

  @Output() onItemDragEnd = new EventEmitter<ItemDragEvent>();

  isDragging: boolean = false
  showTopBorder: boolean = false
  showBottomBorder: boolean = false

  handleDragStart(e: DragEvent) {
    e.stopPropagation()
    this.isDragging = true
  }

  handleDragEnd(e: DragEvent) {
    e.stopPropagation()
    this.isDragging = false
    this.onItemDragEnd.emit({
      baseEvent: e,
      item: this.data,
      parent: this.parent
    })
  }

  handleChildDragEnd(e: ItemDragEvent) {
    this.onItemDragEnd.emit(e)
  }

  handleDragOver(e: DragEvent) {
    e.stopPropagation()

    const el = document.querySelector(`[data-item-id="${this.data.id}"]`)
    if (!el) return;
    const domRect = el.getBoundingClientRect()
    const y = e.clientY;

    this.showTopBorder = false
    this.showBottomBorder = false

    if (y >= domRect.top && y <= domRect.top + this.hoverPadding) {
      this.showTopBorder = true
    } else if (y <= domRect.bottom && y >= domRect.bottom - this.hoverPadding) {
      this.showBottomBorder = true
    }
  }

  handleDragLeave(e: DragEvent) {
    this.showTopBorder = false
    this.showBottomBorder = false
  }

  handleNewElement(e: Event) {
    const target = e.target as HTMLInputElement
    const value = target.value

    const newItem: IItem = {
      id: getUID(),
      title: value,
      lvl: this.data.lvl + 1,
      items: null,
    }

    if (!this.data.items) this.data.items = []
    this.data.items.push(newItem)

    target.value = ''
  }
}
