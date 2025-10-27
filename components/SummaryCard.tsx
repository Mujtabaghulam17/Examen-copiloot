import React from 'react';

// Renders a simple subset of Markdown for headings, lists, and bold text.
const SimpleMarkdownRenderer = ({ content }) => {
    const lines = content.trim().split('\n');
    return (
        <div>
            {lines.map((line, index) => {
                if (line.startsWith('### ')) {
                    return <h3 key={index} style={{marginTop: '24px', marginBottom: '8px'}}>{line.substring(4)}</h3>;
                }
                 if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={index} style={{fontWeight: 600, margin: '12px 0 4px 0'}}>{line.substring(2, line.length - 2)}</p>;
                }
                if (line.startsWith('- ')) {
                    return <p key={index} style={{margin: '4px 0 4px 16px', textIndent: '-16px'}}>• {line.substring(2)}</p>;
                }
                if (line.trim() === '') {
                    return <br key={index} />;
                }
                return <p key={index} style={{margin: '4px 0'}}>{line}</p>;
            })}
        </div>
    );
};

interface SummaryCardProps {
    subject: string;
    content: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ subject, content }) => {
    return (
        <div className="card">
            <h2>Samenvatting {subject}</h2>
            <p className="dashboard-subtitle">De belangrijkste concepten en vaardigheden in een notendop.</p>
            <div className="summary-content" style={{marginTop: '24px'}}>
                 <SimpleMarkdownRenderer content={content} />
            </div>
        </div>
    );
};

export default SummaryCard;