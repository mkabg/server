export default class Riddle {
  constructor({ _id, question, answer, level }) {
    this.id = _id;
    this.question = question;
    this.answer = answer;
    this.level = level;
  }
}