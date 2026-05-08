import { Component,Input,ChangeDetectionStrategy, input } from "@angular/core";
import { required } from "@angular/forms/signals";

@Component({
    selector:'tl-stat-card',
    standalone:true,
    imports:[],
    templateUrl:'./stat-card.component.html',
    styleUrls:['./stat-card.component.scss'],
    changeDetection:ChangeDetectionStrategy.OnPush
})
export class StatCardComponent{

    @Input({required:true}) icon!:string;
    @Input({required:true}) value!:string|number;
    @Input({required:true}) label!:string;
    @Input() variant: 'primary' | 'danger' | 'warning' | 'info' | 'success' = 'primary';
    @Input() suffix?: string;
}