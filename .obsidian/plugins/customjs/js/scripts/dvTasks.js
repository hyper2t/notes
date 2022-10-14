class DvTasks {
  relDateString(d, luxon) {
    if (!(d instanceof luxon.DateTime)) return '–'
    const now = luxon.DateTime.now()
    const days = Math.ceil(d.diff(now, 'days').days)
    if (days < 0) return 'Overdue ' + d.toFormat('L/d')
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    if (days < 7) return d.toFormat('cccc')
    return d.toFormat('ccc L/d')
  }

  getButtonStrings(status) {
    const completed = status === 'Completed'
    const btnStr = completed ? 'Undo' : 'Done'
    const updateStr = completed ? 'To-Do' : 'Completed'
    return { btnStr, updateStr }
  }

  getCustomLink(name, target) {
    return `[[${target}|${name}]]`
  }

  getTodayTasks(args) {
    const { luxon, dv, date, that } = args
    const finalDate = date ?? dv.current().file.name
    return this.getTasksTable({
      ...args,
      filterFn: t => t.status != 'Completed' && t.dueDate && t.dueDate?.hasSame(luxon.DateTime.fromISO(finalDate), 'day')
    })
  }

  getOverdueTasks(args) {
    const { luxon, dv, date, that } = args
    const finalDate = date ?? dv.current().file.name
    return this.getTasksTable({
      ...args,
      prependText: 'Overdue',
      filterFn: t => t.dueDate && t.dueDate < luxon.DateTime.fromISO(finalDate) && t.status != 'Completed'
    })
  }

  getTasksNoDueDate(args) {
    return this.getTasksTable({
      ...args,
      prependText: 'No Due Date',
      filterFn: t => !t.dueDate
    })
  }

  getTasksTable(args) {
    const {
      that,
      app,
      dv,
      luxon,
      getSortProp = t => t.dueDate,
      sortOrder = 'asc',
      filterFn = t => t.task,
      completedCol = false,
      prependHeaderLevel = 3,
      prependText
    } = args;
    const { metaedit, buttons } = app.plugins.plugins
    const { update } = metaedit.api
    const { createButton } = buttons


    const dueStr = completedCol ? 'Completed' : 'Due Date';
    const pages = dv.pages("#task").sort(getSortProp, sortOrder).where(filterFn)
    if (pages.length === 0) {
      // console.log('Empty dataview:', args)
      return
    }

    if (prependText) {
      dv.header(prependHeaderLevel, prependText)
    }

    dv.table(["Name", "Category", dueStr, "", ""], pages
      .map(t => {
        const { btnStr, updateStr } = this.getButtonStrings(t.status)
        return [
          this.getCustomLink(t.task, t.file.name),
          t.category,
          this.relDateString(t.dueDate, luxon),
          createButton({
            app,
            el: that.container,
            args: { name: btnStr },
            clickOverride: { click: update, params: ['Status', updateStr, t.file.path] }
          }),
        ]
      })
    )
  }
}