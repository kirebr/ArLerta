import Bree from "bree";

export default () => {
  const bree = new Bree({
    jobs: [{ name: "fetchApi", interval: "15s" }],
  });

  bree.start();
};
