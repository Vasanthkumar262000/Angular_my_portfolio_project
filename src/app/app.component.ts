import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import {faHome} from '@fortawesome/free-solid-svg-icons';
import {faFilePdf} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true, // Declare it as a standalone component
  imports: [FontAwesomeModule, RouterOutlet], // Import necessary modules
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  title = 'my_portfolio_project';

  constructor(library: FaIconLibrary) {
    library.addIcons(faLinkedin); // Add all solid icons to the library
    library.addIcons(faGithub);
    library.addIcons(faGlobe);
    library.addIcons(faHome);
    library.addIcons(faFilePdf);
  }
}
