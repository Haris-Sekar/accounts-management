import "./Card.css";

const CustomCard = ({
  title,
  value
}: {
  title: any;
  value: any; 
}) => {
  return (
    <div className="revenue-card">
      <div className="cardData">
        <div className="revenue-title">{title}</div>
        <div className="revenue-amount">{value}</div>
      </div> 
    </div>
  );
};

export default CustomCard;
