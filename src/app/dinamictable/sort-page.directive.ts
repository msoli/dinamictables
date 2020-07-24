import { Directive, TemplateRef, ViewContainerRef, ComponentFactoryResolver, Input, OnInit, ElementRef } from '@angular/core';
import { DinamictableComponent } from './dinamictable.component';

@Directive({
  selector: '[appSortPage]'
})
export class SortPageDirective implements OnInit {

  @Input() appSortPage: string;

  constructor(private templateRef: ElementRef,
    private viewContainer: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  ngOnInit() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DinamictableComponent);
    const componentRef = this.viewContainer.createComponent(componentFactory);

    // Pass the template to the dynamic component   
    console.log(componentRef.instance.configTable);

  }

}
