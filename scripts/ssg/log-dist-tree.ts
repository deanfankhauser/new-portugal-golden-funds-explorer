import fs from 'fs';
import path from 'path';

interface TreeNode {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  children?: TreeNode[];
}

/**
 * Recursively build directory tree structure
 */
function buildTree(dirPath: string, maxDepth: number = 3, currentDepth: number = 0): TreeNode[] {
  if (currentDepth >= maxDepth) {
    return [];
  }
  
  const items = fs.readdirSync(dirPath);
  const nodes: TreeNode[] = [];
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    
    if (stats.isDirectory()) {
      const children = buildTree(itemPath, maxDepth, currentDepth + 1);
      nodes.push({
        name: item,
        type: 'directory',
        children: children.length > 0 ? children : undefined
      });
    } else {
      nodes.push({
        name: item,
        type: 'file',
        size: stats.size
      });
    }
  }
  
  return nodes.sort((a, b) => {
    // Directories first, then files
    if (a.type !== b.type) {
      return a.type === 'directory' ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/**
 * Print tree structure with indentation
 */
function printTree(nodes: TreeNode[], prefix: string = '', isLast: boolean = true) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const isLastNode = i === nodes.length - 1;
    const connector = isLastNode ? '└── ' : '├── ';
    const sizeInfo = node.size ? ` (${formatBytes(node.size)})` : '';
    
    console.log(prefix + connector + node.name + sizeInfo);
    
    if (node.children && node.children.length > 0) {
      const newPrefix = prefix + (isLastNode ? '    ' : '│   ');
      printTree(node.children, newPrefix, isLastNode);
    }
  }
}

/**
 * Count files and directories recursively
 */
function countItems(nodes: TreeNode[]): { files: number; dirs: number; totalSize: number } {
  let files = 0;
  let dirs = 0;
  let totalSize = 0;
  
  for (const node of nodes) {
    if (node.type === 'file') {
      files++;
      totalSize += node.size || 0;
    } else {
      dirs++;
      if (node.children) {
        const childCounts = countItems(node.children);
        files += childCounts.files;
        dirs += childCounts.dirs;
        totalSize += childCounts.totalSize;
      }
    }
  }
  
  return { files, dirs, totalSize };
}

/**
 * Log dist directory tree for build diagnostics
 */
export function logDistTree() {
  const distDir = path.join(process.cwd(), 'dist');
  
  console.log('\n📁 Dist Directory Structure:');
  console.log('═'.repeat(60));
  
  if (!fs.existsSync(distDir)) {
    console.log('❌ dist/ directory not found');
    return;
  }
  
  const tree = buildTree(distDir, 3); // Max 3 levels deep
  printTree(tree);
  
  const counts = countItems(tree);
  console.log('═'.repeat(60));
  console.log(`📊 Summary: ${counts.files} files, ${counts.dirs} directories`);
  console.log(`💾 Total size: ${formatBytes(counts.totalSize)}`);
  console.log('');
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  logDistTree();
}
