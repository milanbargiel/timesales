declare module "*.frag" {
  const content: string;
  export default content;
}
declare module "*.vert" {
  const content: string;
  export default content;
}

class Backend {
  Update(progress: Number);
  IsFinished(): boolean;
  Resize(width: number, height: number);
  CreateCanvas(width: number, height: number);
}
