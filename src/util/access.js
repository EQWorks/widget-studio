// from LOCUS

const getAccess = () =>{
  let access = window.localStorage.access
  try {
    if (access) {
      return JSON.parse(access)
    }
  } catch (err) {
    console.error(err)
  }
  return null
}

export const hasDevAccess = (access = getAccess()) => {
  return access?.prefix === 'dev'
}
