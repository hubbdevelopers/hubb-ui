import moment from 'moment'
export default {
  methods: {
    $_howManyDaysAgo(date) {
      return moment(date).fromNow()
    }
  }
}