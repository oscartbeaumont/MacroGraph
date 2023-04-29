import { core } from "../models";
import { types } from "../types";

const pkg = core.createPackage({
  name: "Logic",
});

pkg.createNonEventSchema({
  name: "Branch",
  variant: "Base",
  run({ ctx }) {
    ctx.exec(ctx.getInput<boolean>("condition") ? "true" : "false");
  },
  generateIO(t) {
    t.execInput({
      id: "exec",
      name: "",
    });
    t.dataInput({
      id: "condition",
      name: "Condition",
      type: types.bool(),
    });

    t.execOutput({
      id: "true",
      name: "True",
    });
    t.execOutput({
      id: "false",
      name: "False",
    });
  },
});

pkg.createNonEventSchema({
  name: "AND",
  variant: "Pure",
  run({ ctx }) {
    ctx.setOutput(
      "value",
      ctx.getInput<boolean>("one") && ctx.getInput<boolean>("two")
    );
  },
  generateIO(t) {
    t.dataInput({
      id: "one",
      name: "",
      type: types.bool(),
    });
    t.dataInput({
      id: "two",
      name: "",
      type: types.bool(),
    });
    t.dataOutput({
      id: "value",
      name: "",
      type: types.bool(),
    });
  },
});

pkg.createNonEventSchema({
  name: "NAND",
  variant: "Pure",
  run({ ctx }) {
    ctx.setOutput(
      "value",
      !(ctx.getInput<boolean>("one") && ctx.getInput<boolean>("two"))
    );
  },
  generateIO(t) {
    t.dataInput({
      id: "one",
      name: "",
      type: types.bool(),
    });
    t.dataInput({
      id: "two",
      name: "",
      type: types.bool(),
    });
    t.dataOutput({
      id: "value",
      name: "",
      type: types.bool(),
    });
  },
});

pkg.createNonEventSchema({
  name: "Bools Equal",
  variant: "Pure",
  run({ ctx }) {
    ctx.setOutput(
      "value",
      ctx.getInput<boolean>("one") == ctx.getInput<boolean>("two")
    );
  },
  generateIO(t) {
    t.dataInput({
      id: "one",
      name: "",
      type: types.bool(),
    });
    t.dataInput({
      id: "two",
      name: "",
      type: types.bool(),
    });
    t.dataOutput({
      id: "value",
      name: "",
      type: types.bool(),
    });
  },
});

pkg.createNonEventSchema({
  name: "Bools Not Equal",
  variant: "Pure",
  run({ ctx }) {
    ctx.setOutput(
      "value",
      ctx.getInput<boolean>("one") != ctx.getInput<boolean>("two")
    );
  },
  generateIO(t) {
    t.dataInput({
      id: "one",
      name: "",
      type: types.bool(),
    });
    t.dataInput({
      id: "two",
      name: "",
      type: types.bool(),
    });
    t.dataOutput({
      id: "value",
      name: "",
      type: types.bool(),
    });
  },
});

pkg.createNonEventSchema({
  name: "OR",
  variant: "Pure",
  run({ ctx }) {
    ctx.setOutput(
      "value",
      ctx.getInput<boolean>("one") || ctx.getInput<boolean>("two")
    );
  },
  generateIO(t) {
    t.dataInput({
      id: "one",
      name: "",
      type: types.bool(),
    });
    t.dataInput({
      id: "two",
      name: "",
      type: types.bool(),
    });
    t.dataOutput({
      id: "value",
      name: "",
      type: types.bool(),
    });
  },
});

pkg.createNonEventSchema({
  name: "NOR",
  variant: "Pure",
  run({ ctx }) {
    ctx.setOutput(
      "value",
      !(ctx.getInput<boolean>("one") || ctx.getInput<boolean>("two"))
    );
  },
  generateIO(t) {
    t.dataInput({
      id: "one",
      name: "",
      type: types.bool(),
    });
    t.dataInput({
      id: "two",
      name: "",
      type: types.bool(),
    });
    t.dataOutput({
      id: "value",
      name: "",
      type: types.bool(),
    });
  },
});

pkg.createNonEventSchema({
  name: "XOR",
  variant: "Pure",
  run({ ctx }) {
    ctx.setOutput(
      "value",
      ctx.getInput<boolean>("one") != ctx.getInput<boolean>("two")
    );
  },
  generateIO(t) {
    t.dataInput({
      id: "one",
      name: "",
      type: types.bool(),
    });
    t.dataInput({
      id: "two",
      name: "",
      type: types.bool(),
    });
    t.dataOutput({
      id: "value",
      name: "",
      type: types.bool(),
    });
  },
});

pkg.createNonEventSchema({
  name: "NOT",
  variant: "Pure",
  run({ ctx }) {
    ctx.setOutput("output", ctx.getInput<boolean>("input"));
  },
  generateIO(t) {
    t.dataInput({
      id: "input",
      name: "",
      type: types.bool(),
    });
    t.dataOutput({
      id: "output",
      name: "",
      type: types.bool(),
    });
  },
});
