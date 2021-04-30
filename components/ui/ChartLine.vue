<template>
  <div class="card pa-3">
    <div class="card-body">
      <h2 class="card-title">Viewer Statistics</h2>
    </div>

    <div class="card-img-bottom">
      <chartjs-line
        :backgroundcolor="bgColor"
        :beginzero="beginZero"
        :bind="true"
        :bordercolor="borderColor"
        :data="data"
        datalabel="Views Count"
        :labels="label"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    label: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      bgColor: "#81894e",
      beginZero: true,
      borderColor: "#27c575",
      // data: {
      //   day: [1, 3, 5, 3, 1],
      //   week: [12, 14, 16, 18, 11, 13, 15]
      // },
      dataLabel: "Foo",
      labels: {
        day: [8, 10, 12, 14, 16],
        week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      },
      radio: "day"
    };
  }
};
</script>
