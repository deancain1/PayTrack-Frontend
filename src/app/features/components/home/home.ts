import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Often needed for standard directives
import { 
  LucideAngularModule, 
  Wallet, 
  Info, 
  QrCode, 
  ChevronRight 
} from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  // This 'imports' array is what tells the compiler about <i-lucide>
  imports: [
    CommonModule, 
    LucideAngularModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home {
  // No extra logic needed here if icons are provided in app.config.ts,
  // but it's safe to keep the class clean.
}