import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FilterItem } from "../../models/filter-item.model";
import { IonicModule } from "@ionic/angular";
import { addIcons } from "ionicons";
import { filter } from "ionicons/icons";

@Component({
  selector: 'select-filter',
  templateUrl: './select-filter.component.html',
  standalone: true,
  imports: [IonicModule],
})
export class SelectFilterComponent {
  selectedItem!: string;

  @Input({required: true})
  label!: string;

  @Input({required: true})
  items!: FilterItem[];

  @Input({required: true})
  defaultValue!: string;

  @Output()
  selectedItemEmiter = new EventEmitter<string>();


  constructor() {
    addIcons({filter});
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