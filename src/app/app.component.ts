import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faJava, faLinkedin, faPython, faGithub, faJs, faReact, faSquareJs, faBootstrap} from '@fortawesome/free-brands-svg-icons';
import { faGlobe,faFilePdf,faHome, faDatabase } from '@fortawesome/free-solid-svg-icons';

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
    library.addIcons(faLinkedin);
    library.addIcons(faGithub);
    library.addIcons(faGlobe);
    library.addIcons(faHome);
    library.addIcons(faFilePdf);
    library.addIcons(faPython);
    library.addIcons(faJava);
    library.addIcons(faJs);
    library.addIcons(faReact);
    library.addIcons(faSquareJs);
    library.addIcons(faBootstrap);
    library.addIcons(faDatabase);
  }
}
