function Datalist({data, id}) {
  return <datalist id={id}>{data.map(i => <option value={i} />)}</datalist>
}

export default Datalist
