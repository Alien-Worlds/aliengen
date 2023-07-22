const { Confirm } = require("enquirer");

export class InteractionPrompts {
  public static continue(message: string) {
    return new Promise((resolve, reject) => {
      const prompt = new Confirm({
        name: "question",
        message: `${message} Do you want to continue?`,
      });

      prompt
        .run()
        .then((answer) => resolve(answer.toString() === "true"))
        .catch(reject);
    });
  }
}
