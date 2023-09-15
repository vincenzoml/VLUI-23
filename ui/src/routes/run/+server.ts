import { json } from '@sveltejs/kit'
import { execa } from 'execa'
import { promises as fs } from 'fs'

const voxlogica = "/home/VoxLogicA/binaries/VoxLogicA_1.3.3-experimental_linux-x64/VoxLogicA"

export async function POST({ request }) {
  const data = await request.json() as { specification: string, items: { dataset: string, item: string }[] }

  const dirName = await fs.mkdtemp('/tmp/my-pipe-')
  const specificationPath = `${dirName}/specification.imgql`
  await fs.writeFile(specificationPath, data.specification)


  // Read from the pipe using the executable
  const { stdout } = await execa(voxlogica, ["--json", specificationPath])
  return json(stdout)
}