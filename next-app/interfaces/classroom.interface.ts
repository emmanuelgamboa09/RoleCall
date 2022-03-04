export interface Classroom {
  _id?: string;
  instructorId: string;
  title: string;
  students?: Array<string>;
  endDate: Date;
  accessCode?: string;
}
