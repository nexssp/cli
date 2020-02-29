module.exports = (data, nxsRenameFrom = "nxsOut", nxsRenameTo) => {
  if (!nxsRenameFrom || !nxsRenameTo) {
    console.error(
      "To rename you need to pass --nxsRenameFrom and --nxsRenameTo"
    );
    process.exit(0);
  }

  if (nxsRenameFrom === nxsRenameTo) {
    console.error("--nxsRenameFrom and --nxsRenameTo cannot be the same.");
    process.exit(0);
  }

  data[nxsRenameTo] = data[nxsRenameFrom];
  delete data[nxsRenameFrom];
  delete data["nxsRenameFrom"];
  delete data["nxsRenameTo"];

  return data;
};
