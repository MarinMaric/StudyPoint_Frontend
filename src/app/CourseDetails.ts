import {LessonBriefVM} from "./LessonBriefVM";

export class CourseDetailsVM{
  courseId:number;
  title:string;
  imageDisplay:string;
  image:File;
  imageBlob:Blob;
  imageFromBlob:any;
  description:string;
  lessons:LessonBriefVM[];
  adminMode:boolean;
}
