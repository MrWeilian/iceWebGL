import * as path from 'path'
import * as fsPromises from 'fs/promises'

export const contentBasePath = () => {
  return path.resolve(__dirname, '../content')
}

const outPutBasePath = () => {
  return path.resolve(__dirname, '../.vitepress/configs')
}

const getContentSideBar = async () => {
  const resolvePath = contentBasePath()

  const dirArr = await fsPromises.readdir(resolvePath)

  return Promise.all(dirArr.map(async (dirItemPath: string) => {
    const dirPath = `${resolvePath}/${dirItemPath}`
    const fileArr = await fsPromises.readdir(dirPath)

    return {
      text: dirItemPath,
      collapsible: true,
      collapsed: false,
      items: await Promise.all(fileArr.map(async (fileName: string) => {
        const buffer = await fsPromises.readFile(`${dirPath}/${fileName}`)
        const fileStr = buffer.toString()
        const reg = /(?<=#\s).*?(?=\n)/

        const sideName = reg.exec(fileStr) && (reg.exec(fileStr) as Array<string>)[0]
        return {
          text: sideName,
          link: `/content/${dirItemPath}/${fileName.replace('.md', '')}`
        }
      }))
    }
  }))
}

export default function createSideBar () {
  return {
    buildStart: async () => {
      const sideBarArr = await getContentSideBar()
      const outPutFile = `${outPutBasePath()}/sidebarConfig.json`
      const stat = await fsPromises.stat(outPutFile)
      if (stat.isFile()) {
        const json = await fsPromises.readFile(outPutFile, 'utf-8')
        if (JSON.stringify(sideBarArr) === json) return
      }
      await fsPromises.writeFile(outPutFile, JSON.stringify(sideBarArr), {
        encoding: 'utf-8'
      })
    }
  }
}
