import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }  from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
// import { MDBBootstrapModule } from 'angular-bootstrap-md';
// import { HttpClientModule } from '@angular/common/http';
// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { AppComponent } from './app.component';
import { ContentChoicesComponent }  from './contentChoices.component';
//import { InMemoryDataService1} from './in-memory-data-service1';
//import { ImportExcel1Component } from './importExcel1.component';
import { DragAndDropModule } from 'angular-draggable-droppable';
//import { DropEvent } from 'angular-draggable-droppable';
// import  axios            from 'axios';  //needs to go into api-client
// import { AxiosInstance } from 'axios';  //needs to go into api-client
@NgModule({
  declarations: [
    AppComponent,
    ContentChoicesComponent
    //,ImportExcel1Component
  ],
  imports: [
    DragAndDropModule,
    BrowserModule,
    FormsModule
    // MDBBootstrapModule.forRoot() 
    //HttpClientModule,
    // HttpClientInMemoryWebApiModule.forRoot(
    //   InMemoryDataService1, { dataEncapsulation: false },
    // ) 
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [],
  //providers: [InMemoryDataService1],
  bootstrap: [AppComponent]
})
export class AppModule { }
