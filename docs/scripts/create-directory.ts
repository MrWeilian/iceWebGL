import * as path from 'path'
import * as fsPromises from 'fs/promises'
import { contentBasePath } from './create-side-bar';

const outPutBasePath = () => {
  return path.resolve(contentBasePath(), './一、前言')
}

const getDirectory = async (): Promise<directoryTree[]> => {
  const resolvePath = contentBasePath()

  const dirArr = await fsPromises.readdir(resolvePath)

  return Promise.all(dirArr.map(async (dirItemPath: string) => {
    const dirPath = `${resolvePath}/${dirItemPath}`
    const fileArr = await fsPromises.readdir(dirPath)
    const fileContentArr = []
    for (const file of fileArr) {
      const contentBuffer = await fsPromises.readFile(path.resolve(resolvePath, dirItemPath, file))
      const fileStr = contentBuffer.toString('utf8')
      const firstTitleReg = /(?<=(#))\s.+(?=\n)/g
      const secondTitleReg = /(?<=(\n#{2}\s)).+?(?=\n)/g

      const firstTitle = fileStr.match(firstTitleReg)?.[0]
      const secondTitles = fileStr.match(secondTitleReg)

      firstTitle && fileContentArr.push({
        title: firstTitle,
        children: secondTitles?.map(_ => ({ title: _ }))
      })
    }

    return {
      title: dirItemPath,
      children: fileContentArr
    }
  }))
}

interface directoryTree {
  title: string
  children: directoryTree[]
}

const treeTitle = (directoryTree: directoryTree[], deep = 0): string => {
  return directoryTree.reduce((acc, cur) => {
    const TAB = new Array(deep).fill('#')
    acc += deep > 0 ? [...TAB, `# ${cur.title}\n\n`].join('') : `# ${cur.title}\n\n`
    if (cur.children) {
      acc += treeTitle(cur.children, deep + 1)
    }
    return acc
  }, '')
}

export default function createDirectory () {
  return {
    buildStart: async () => {
      const outPutFile = `${outPutBasePath()}/0. 目录.md`
      // try {
      //   const stat = await fsPromises.stat(outPutFile)
      //   if (stat.isFile()) {
      //     await fsPromises.unlink(outPutFile)
      //   }
      // } catch (e) {
      //
      // }
      const directoryTree = await getDirectory()

      console.log('directoryTree', directoryTree);

      const everyTitleStr = treeTitle(directoryTree)

      const directoryStr = `# 目录
      ${everyTitleStr}
      `
      await fsPromises.writeFile(outPutFile, directoryStr, {
        encoding: 'utf-8'
      })
    }
  }
}
