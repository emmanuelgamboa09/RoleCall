export interface Classroom {
  _id?: string;
  instructorId: string;
  accessCode?: string;
  title: string;
  students?: Array<string>;
  endDate: Date;
}
