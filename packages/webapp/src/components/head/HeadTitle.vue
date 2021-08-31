<script>
export default {
  name: "HeadTitle",
  props: ["title"],
  watch: {
    title: {
      immediate: true,
      handler() {
        document.title = this.title;
      },
    },
  },
  render() {
    return null;
  },
};
</script>
