import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FilterItem } from "../../models/filter-item.model";
import { IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { addIcons } from "ionicons";
import { filter } from "ionicons/icons";

@Component({
  selector: 'select-filter',
  templateUrl: './select-filter.component.html',
  standalone: true,
  imports: [IonSelect, IonSelectOption],
})
export class SelectFilterComponent {
  selectedItem!: string;

  @Input({ required: true })
  label!: string;

  @Input({ required: true })
  items!: FilterItem[];

  @Input({ required: true })
  defaultValue!: string;

  @Output()
  selectedItemEmiter = new EventEmitter<string>();

  constructor() {
    addIcons({ filter });
  }

  ngOnInit(): void {
    this.selectedItem = this.defaultValue;
  }

  onSelectItem(event: CustomEvent) {
    if (this.selectedItem !== event.detail.value) {
      this.selectedItem = event.detail.value;
      this.selectedItemEmiter.emit(this.selectedItem);
    }
  }
}