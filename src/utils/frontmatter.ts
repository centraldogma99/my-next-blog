export function generateFrontmatter(formData: FormData): string {
  const title = formData.get('title') as string;
  const tags = formData.get('tags') as string;
  const description = formData.get('description') as string;
  const slug = formData.get('slug') as string;
  const date = formData.get('date') as string;
  const draft = formData.get('draft') as string;
  
  const tagsArray = tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
  
  // 날짜가 제공되지 않으면 현재 날짜 사용
  const formattedDate = date || (() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  })();
  
  let frontmatter = '---\n';
  frontmatter += `title: "${title}"\n`;
  frontmatter += `date: "${formattedDate}"\n`;
  
  if (tagsArray.length > 0) {
    // YAML 리스트 형식으로 태그 추가
    frontmatter += 'tag:\n';
    tagsArray.forEach(tag => {
      frontmatter += `  - ${tag}\n`;
    });
  }
  
  if (description) {
    frontmatter += `description: "${description}"\n`;
  }
  
  if (slug) {
    frontmatter += `slug: "${slug}"\n`;
  }
  
  // draft 필드는 항상 포함
  frontmatter += `draft: ${draft === 'true' ? 'true' : 'false'}\n`;
  
  frontmatter += '---\n\n';
  
  return frontmatter;
}