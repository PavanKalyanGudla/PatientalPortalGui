import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @ViewChild('textContainer') textContainer!: ElementRef;

  private txt: string = "Hi Hello Welcome back to Patiental portal!, your trusted companion in healthcare excellence! We're thrilled to embark on this journey with you, prioritizing your well-being.";
  private speed: number = 50;
  private index: number = 0;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.typeWriter();
  }

  typeWriter() {
    if (this.index < this.txt.length) {
      this.renderer.setProperty(
        this.textContainer.nativeElement,
        'textContent',
        this.txt.substring(0, this.index + 1)
      );
      this.index++;
      setTimeout(() => this.typeWriter(), this.speed);
    }
  }

}
