<template>
  <Modal />
  <router-view></router-view>
</template>

<script>
import Modal from "@/components/Modal";

export default {
  name: "App",
  components: {
    Modal,
  },
}
</script>
