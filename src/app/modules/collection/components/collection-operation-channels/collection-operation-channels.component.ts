import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'two-collection-operation-channels',
  templateUrl: './collection-operation-channels.component.html',
  styleUrls: ['./collection-operation-channels.component.scss']
})
export class CollectionOperationChannelsComponent implements OnInit {

  todo = [
    'Get to work',
    'Pick up groceries'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower'
  ];

  constructor() { }

  ngOnInit() {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
}
