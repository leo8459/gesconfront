import Vue from 'vue';

Vue.mixin({
  methods: {
    dash(value) {
      if (value === null || value === undefined || value === '') {
        return '-';
      }
      return value;
    },
  },
});
