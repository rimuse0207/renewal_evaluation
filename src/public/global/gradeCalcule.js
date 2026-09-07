export const gradeCalcule = (perf_score, comp_score) => {
  if (!perf_score || !comp_score) {
    return "-";
  }

  if ((perf_score + comp_score) / 2 >= 90) {
    return "A";
  } else if ((perf_score + comp_score) / 2 >= 80) {
    return "B";
  } else if ((perf_score + comp_score) / 2 >= 70) {
    return "C";
  } else {
    return "D";
  }
};
