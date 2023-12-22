import React, { useState, useEffect } from "react";
import { Select } from '@chakra-ui/react'

const TenseDropdown = ({ onSelect }) =>
{
    const [selectedTenses, setSelectedTenses] = useState([])
    const [allTenses, setAllTenses] = useState([])

    const handleSelect = (event) =>
    {
        const parentTenseName = event.target.value;
        console.log("Dropdown will get", getChildInternalStrings(parentTenseName));
        setSelectedTenses(getChildInternalStrings(parentTenseName));
        onSelect(getChildInternalStrings(parentTenseName));
    };

    function getChildInternalStrings(parentTenseName)
    {
        const parentTense = allTenses[parentTenseName];
        if (!parentTense)
        {
            return [];
        }
        return parentTense.map((tense) => tense.internal);
    }

    useEffect(() =>
    {
        fetch('./tenses.json')
            .then((response) => response.json())
            .then((data) => setAllTenses(data))
            .catch((error) => console.error('Error loading tense data:', error));
    }, [])

    return (
        <Select
            value={selectedTenses}
            onChange={handleSelect}
            placeholder="Select a tense"
        >
            {Object.keys(allTenses).map((tense) => (
                <option key={tense} value={tense}>
                    {tense}
                </option>
            ))}
        </Select>
    )
}
export default TenseDropdown; 