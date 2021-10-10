import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import { ViewCoursesComponent } from './TeacherComponents/view-courses/view-courses.component';
import { EditCourseComponent } from './TeacherComponents/edit-course/edit-course.component';
import { CourseDetailsComponent } from './TeacherComponents/course-details/course-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { UploadCourseComponent } from './TeacherComponents/upload-course/upload-course.component';
import { UploadLessonComponent } from './TeacherComponents/upload-lesson/upload-lesson.component';
import { LessonDetailsComponent } from './TeacherComponents/lesson-details/lesson-details.component';

@NgModule({
  declarations: [
    AppComponent,
    ViewCoursesComponent,
    EditCourseComponent,
    CourseDetailsComponent,
    UploadCourseComponent,
    UploadLessonComponent,
    LessonDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: 'upload-course', component: UploadCourseComponent},
      {path: 'view-courses', component: ViewCoursesComponent},
      {path: 'edit-course/:courseID', component: EditCourseComponent},
      {path: 'course-details/:courseID', component: CourseDetailsComponent},
      {path: 'upload-lesson/:courseID', component: UploadLessonComponent},
      {path: 'lesson-details/:lessonID', component: LessonDetailsComponent}
    ]),
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
