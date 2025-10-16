import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faJava, faLinkedin, faPython, faGithub, faJs, faReact, faSquareJs, faBootstrap, faUpwork, faGit, faHtml5} from '@fortawesome/free-brands-svg-icons';
import { faGlobe,faFilePdf,faHome, faDatabase, faServer, faCode, faUser } from '@fortawesome/free-solid-svg-icons';
import { SplitTextComponent } from './components/split-text.component'; // <-- add this
import { HoverGlowDirective } from './components/hover-glow.direction';
import { RotatingTextComponent } from './components/rotating-text.component';

@Component({  
  selector: 'app-root',
  standalone: true, // Declare it as a standalone component
  imports: [FontAwesomeModule, RouterOutlet,SplitTextComponent, HoverGlowDirective, RotatingTextComponent], // Import necessary modules
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected 'styleUrl' to 'styleUrls'
})
export class AppComponent {
  title = 'my_portfolio_project';

  showAppContact = true;
  showskill = true;
  showContact = true;
  showexperiance = true;
  showeducation = true;
  showfavorites = true;

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
    library.addIcons(faUpwork);
    library.addIcons(faGit);
    library.addIcons(faCode);
    library.addIcons(faHtml5);
    library.addIcons(faUser)
  }
 toggleSection(section: string) {
    switch (section) {
      case 'App-contact':
        this.showAppContact = !this.showAppContact;
        break;
      case 'skill':
        this.showskill = !this.showskill;
        break;
      case 'experiance':
        this.showexperiance = !this.showexperiance;
        break;
      case 'education':
        this.showeducation = !this.showeducation;
        break;
      case 'favorites':
        this.showfavorites = !this.showfavorites;
        break;

    }
  }
    handleAnimationComplete() {
    console.log('All letters have animated!');
  }
}