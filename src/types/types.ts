export type TaskProps = {
  id: string;
  name: string;
  projectId?: "Personal" | "Work" | "Education" | "Other"; 
  description: string;
  createdDate: Date;
  dueDate: Date;
  priority: "Low" | "Medium" | "High";
  status: "not-started" | "in-progress" | "done"; 
  comments?: string[];
  tags?: string[];
};