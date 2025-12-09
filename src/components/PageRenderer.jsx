import ComponentRenderer from './ComponentRenderer';
import styles from './page.module.scss'

export default function PageRenderer({ page }) {
  const { content } = page;

  
  return (
    <div className={styles.page}>
      {content && content.map((component, index) => (
        <ComponentRenderer key={index} component={component}  />
      ))}
    </div>
  );
}