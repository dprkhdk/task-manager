export type TaskProps = {
  id: string;
  name: string;
  description: string;
  createdDate: Date;
  dueDate: Date;
  priority: "Low" | "Medium" | "High";
  status: "not-started" | "in-progress" | "done"; 
  comments?: string[];
  tags?: string[];
};