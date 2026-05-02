import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IonChip } from '@ionic/angular/standalone';
import { FilterItem } from "../../models/filter-item.model";

@Component({
  selector: 'chip-filter',
  templateUrl: './chip-filter.component.html',
  styleUrl: './chip-filter.component.scss',
  standalone: true,
  imports: [IonChip],
})
export class ChipFilterComponent implements OnInit {

  selectedChip!: string;

  @Input({required: true})
  chips!: FilterItem[];

  @Input({required: true})
  defaultValue!: string;

  @Output()
  selectedChipsEmiter = new EventEmitter<string>();

  ngOnInit(): void {
    this.selectedChip = this.defaultValue;  
  }


  onToggleChip(chip: FilterItem) {
    if (this.selectedChip !== chip.id) {
      this.selectedChip = chip.id;
      this.selectedChipsEmiter.emit(this.selectedChip);
    }
  }
}