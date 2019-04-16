import moment from 'moment'
export default {
  methods: {
    $$howManyDaysAgo(date) {
      return moment(date).fromNow()
    }
  }
}
