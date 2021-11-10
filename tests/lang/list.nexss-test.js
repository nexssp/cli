module.exports = {
  nexsstests: [
    {
      params: ['nexss l l', ' ext      │ repository   '],
    },
    {
      params: ['nexss l l --comma', /\.\w+(\, \.\w+)+/],
    },
    {
      params: ['nexss l l --list', /\.\w+(\n\.\w+)+/],
    },
  ],
}
