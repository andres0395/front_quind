import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { StorageService } from './services/storage.service';
import { FlowbiteService } from './services/flowbite.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private storage = inject(StorageService);
  private flowbiteService = inject(FlowbiteService);
  ngOnInit(): void {
    this.flowbiteService.loadFlowbite(flowbite => {
      console.log('loaded');
    });
    this.storage.setInformationData();
  }
}
