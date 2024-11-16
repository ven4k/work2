<template>
  <notifications
    :position="position"
    :duration="duration"
    :width="width"
  >
    <template #body="props">
      <div :class="['custom-notification', props.item.type]">
        <button class="close" @click="props.close">
          <span class="fa fa-fw fa-close">X</span>
        </button>
        <div class="notification-title">{{ props.item.title }}</div>
        <div class="notification-content">{{ props.item.text }}</div>
      </div>
    </template>
  </notifications>
</template>

<script>
import { Notifications } from '@kyvg/vue3-notification';
export default {
  name: 'CustomNotification',
  components: {
    Notifications,
  },
  props: {
    position: {
      type: String,
      default: 'top right',
    },
    duration: {
      type: Number,
      default: 5000,
    },
    width: {
      type: [String, Number],
      default: 300,
    },
    close: {
      type: Function,
    },
  },
};
</script>

<style lang="scss" scoped>
.custom-notification {
  position: relative;
  padding: 8px;
  margin: 2px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-notification.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.custom-notification.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.custom-notification.warn {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.custom-notification.info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.notification-title {
  font-weight: bold;
}

.notification-content {
  margin-top: 5px;
}
.close {
  position: absolute;
  top: 2px;
  right: 2px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: inherit;
  padding: 0;
  line-height: 1;
  outline: none;

  &:hover {
    color: #000;
  }

  .fa {
    font-size: 24px;
  }
}
</style>