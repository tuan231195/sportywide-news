import React from 'react';
import { Label, SemanticCOLORS } from 'semantic-ui-react';

export function RatingTag({ rating }) {
    let ratingText = 'N/A';
    let ratingColor: SemanticCOLORS;
    rating = isNaN(rating) ? 0 : parseFloat(rating);
    if (rating > 0) {
        ratingText = `${rating.toFixed(1)} / 5`;
        if (rating < 3) {
            ratingColor = 'red';
        } else if (rating < 4) {
            ratingColor = 'teal';
        } else {
            ratingColor = 'orange';
        }
    } else {
        ratingColor = 'grey';
    }
    return (
        <Label as="a" color={ratingColor} ribbon="right">
            {ratingText}
        </Label>
    );
}
