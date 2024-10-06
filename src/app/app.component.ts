import { Component } from '@angular/core';
import {IItem, ItemDragEvent} from '../item/item.model';
import getUID from '../helpers/getUID';

// Function just for keep code cleaner. Generates test items. Can be removed
function generateItems(elCount: number, maxLvl: number): IItem[] {
  // First lvl is a Group
  const f = (lvl: number = 1, parent: number | null = null) => {
    let count = elCount;

    const items: IItem[] = [];
    for (let i = 0; i < count; i++) {
      const id = getUID()
      let title = `Id ${id} - Group ${i + 1}`;
      if (parent !== null) title = `Id ${id} - Lvl ${lvl} - Item ${i + 1} - Parent ${parent + 1}`;

      items.push({
        items: maxLvl - lvl === 0 ? null : f(lvl + 1, i),
        title,
        lvl,
        id,
      });
    }

    return items;
  };

  const res = f();
  return res;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  items: IItem[] = generateItems(3, 4)
  hoverPadding: number = 20

  handleDragEnd(e: ItemDragEvent) {
    let itemsFromRemove = e.parent?.items
    if (e.parent === null) {
      itemsFromRemove = this.items
    }

    if (!itemsFromRemove) return;
    let removedIdx = null;
    for (let i = 0; i < itemsFromRemove.length; i++) {
      if (itemsFromRemove[i].id === e.item.id) {
        itemsFromRemove.splice(i, 1)
        removedIdx = i
        break;
      }
    }

    let isAdded = false;
    const y = e.baseEvent.clientY;
    const add = (items: IItem[], lvl: number) => {
      for (let [i, item] of items.entries()) {
        if (!(
          e.item.lvl === lvl ||
          ( e.item.lvl === 4 && lvl === 3 )
        )) {
          add(item.items || [], lvl + 1)
          if (isAdded) return
          continue
        }

        const el = document.querySelector(`[data-item-id="${item.id}"]`)
        if (!el) continue;
        const domRect = el.getBoundingClientRect()

        if (
          !item.items?.length &&
          item.lvl !== 4 &&
          y >= domRect.top &&
          y <= domRect.bottom
        ) {
          item.items = [e.item]
          isAdded = true
          return
        } else if (y >= domRect.top && y <= domRect.top + this.hoverPadding) {
          // add top sibling
          items.splice(i, 0, e.item)
          isAdded = true
          return
        } else if (y <= domRect.bottom && y >= domRect.bottom - this.hoverPadding) {
          // add bottom sibling
          items.splice(i + 1, 0, e.item)
          isAdded = true
          return
        } else {
          add(item.items || [], lvl + 1)
          if (isAdded) return
        }
      }
    }
    add(this.items, 1)

    if(!isAdded && removedIdx !== null) {
      itemsFromRemove.splice(removedIdx, 0, e.item)
    }
  }
}
