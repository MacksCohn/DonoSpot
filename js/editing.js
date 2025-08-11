// Max Cohn
// editing.js
(async () => {
const { useState, useEffect } = React;

// Get charity ID from URL
const urlParams = new URLSearchParams(window.location.search);  // Default to American Red Cross if no ID
const cid = urlParams.get('cid') || "3ItNyesqTpHx1XbHNkSl";
const profile = firebase.doc(db, "charities", cid);
const UID = localStorage.getItem('UID');
let isOwner = (await loadProfile(profile)).OwnerUID === UID;

//returns key value pairs - data.Name and data.Bio for now
async function loadProfile() {
    const snap = await firebase.getDoc(profile);
    if (snap.exists()) {
        const data = snap.data();
        return data;
    }
    return {};  // Return empty object if no data
}

//capital = db, lowecase = local
async function saveProfile(name, categories, bio, imageUrls) {
    await firebase.setDoc(profile, {
        Name: name,
        Categories: categories,
        Bio: bio,
        ImageUrls: imageUrls || "", // Ensure this is included
        OwnerUID: UID // Make sure this is preserved
    }, { merge: true });
}

let editableIds = []
function Header() {
    return(
        <>
        <a href="index.html"><div className="logo">DONO<span className="heart">❤</span>SPOT</div></a>
        <LoginButton />
        <br />
        </>
    );
}

function LoginButton() {
    const Logout = () => {
        localStorage.setItem('UID', 'null');
        location.reload();
    }

    if (UID === 'null')
        return(
            <a href='login.html'>
                <button id='login'>Login</button>
            </a>
        );
    else
        return(
            <button id='login' onClick={Logout}>Log Out</button>
        );
}

function Main() {
    const [mode, setMode] = useState('read');
    const [donateLink, setDonateLink] = useState('');
    const [imageUrls, setImageUrls] = useState('');
    const [charityData, setCharityData] = useState({});

    useEffect(() => {
        loadProfile().then((data) => {
            setCharityData(data);
            if (data.donate) setDonateLink(data.donate);
            if (data.ImageUrls) {
                setImageUrls(data.ImageUrls);
            } else if (data.ImageUrl) {
                setImageUrls(data.ImageUrl);
            }
        });
    }, []);

    const handlePublish = async () => {
        const updates = {};
        let hasErrors = false;
        
        // Collect all updates
        for (const id of editableIds) {
            const element = document.getElementById(id);
            if (element) {
                let value = element.value || element.textContent;
                
                if (id === 'ImageUrls') {
                    value = value.trim();
                    if (value) {
                        const urls = value.split(',')
                            .map(url => url.trim())
                            .filter(url => url)
                            .map(url => {
                                if (!url.startsWith('http')) {
                                    url = 'https://' + url;
                                }
                                return url;
                            });
                        
                        for (const url of urls) {
                            if (!url.match(/\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i)) {
                                alert('Image URLs must end with .jpg, .jpeg, .png, .gif, or .webp');
                                hasErrors = true;
                                break;
                            }
                        }
                        
                        value = urls.join(', ');
                    }
                }
                
                updates[id] = value;
            }
        }

        if (hasErrors) return;

        try {
            // Include ImageUrls in the updates
            if (imageUrls) {
                updates.ImageUrls = imageUrls;
            }
            
            await firebase.setDoc(profile, updates, { merge: true });
            console.log('Successfully saved:', updates);
            
            // Update local state
            if (updates.ImageUrls) setImageUrls(updates.ImageUrls);
            if (updates.donate) setDonateLink(updates.donate);
            
            // Update charity data
            setCharityData(prev => ({ ...prev, ...updates }));
            
            setMode('read');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving changes. Please try again.');
        }
    };

    const ToggleMode = () => {
        setMode(prevMode => (prevMode === 'read' ? 'edit' : 'read'));
    }

    if (isOwner === true) {
        return(
            <div>
                <ModeButton mode={mode} onToggle={ToggleMode} /> 
                <Editable id='Name' type='h1' mode={mode}>{charityData.Name || 'Loading...'}</Editable>
                <Editable id='Categories' type='p' mode={mode}>{charityData.Categories || 'Loading...'}</Editable>
                <Editable id='Bio' type='p' mode={mode}>{charityData.Bio || 'Loading...'}</Editable>
                <MultiImageCarousel mode={mode} imageUrls={imageUrls} setImageUrls={setImageUrls} />
                <DonateButton mode={mode}>{donateLink}</DonateButton>
                <br />
                <PublishButton onPublish={handlePublish} />
            </div>
        );
    } else {
        return(
            <div>
                <Editable id='Name' type='h1' mode={'read'}>{charityData.Name || 'Loading...'}</Editable>
                <Editable id='Categories' type='p' mode={'read'}>{charityData.Categories || 'Loading...'}</Editable>
                <Editable id='Bio' type='p' mode={'read'}>{charityData.Bio || 'Loading...'}</Editable>
                <MultiImageCarousel mode={'read'} imageUrls={imageUrls} />
                <DonateButton mode={'read'}>{donateLink}</DonateButton>
            </div>
        );
    }
}

function MultiImageCarousel({mode, imageUrls, setImageUrls}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [currentImages, setCurrentImages] = useState([]);

    // Parse and update image URLs whenever the prop changes
    useEffect(() => {
        const urls = (imageUrls || '').split(',').map(url => url.trim()).filter(url => url);
        setCurrentImages(urls);
    }, [imageUrls]);

    const handleImageError = (e) => {
        console.error('Failed to load image:', e.target.src);
        e.target.onerror = null;
        e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Found';
        setHasError(true);
    };

    const handleImageLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === currentImages.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? currentImages.length - 1 : prevIndex - 1
        );
    };

    if (mode === 'read') {
        return (
            <div className="image-carousel">
                {currentImages.length > 0 && (
                    <>
                        <h3>Gallery</h3>
                        <div className="carousel-container">
                            {currentImages.length > 1 && (
                                <button className="carousel-button prev" onClick={prevImage}>
                                    &lt;
                                </button>
                            )}
                            <div className="carousel-slide">
                                {isLoading && <p className="image-loading">Loading image...</p>}
                                {hasError && (
                                    <p className="image-error">
                                        Couldn't load image. Please check the URL is correct.
                                    </p>
                                )}
                                <img 
                                    src={currentImages[currentIndex]}
                                    alt={`Charity image ${currentIndex + 1}`}
                                    className="carousel-image"
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                    onLoadStart={() => setIsLoading(true)}
                                />
                            </div>
                            {currentImages.length > 1 && (
                                <button className="carousel-button next" onClick={nextImage}>
                                    &gt;
                                </button>
                            )}
                        </div>
                        {currentImages.length > 1 && (
                            <div className="carousel-indicators">
                                {currentImages.map((_, index) => (
                                    <span 
                                        key={index}
                                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    } else if (mode === 'edit') {
        return (
            <div className="image-edit">
                <label>Image URLs (comma separated):</label>
                <textarea
                    id='ImageUrls'
                    value={imageUrls || ''}
                    onChange={(e) => {
                        setImageUrls(e.target.value);
                        setHasError(false);
                    }}
                    placeholder="https://i.imgur.com/example1.jpg, https://i.imgur.com/example2.jpg"
                    rows={3}
                />
                <p className="image-hint">
                    <strong>Example:</strong> https://i.imgur.com/nQUJW9e.jpeg, https://i.imgur.com/example2.jpg
                </p>
                
                {currentImages.length > 0 && (
                    <div className="carousel-preview">
                        <h4>Live Preview:</h4>
                        <div className="carousel-container">
                            {currentImages.length > 1 && (
                                <button className="carousel-button prev" onClick={prevImage}>
                                    &lt;
                                </button>
                            )}
                            <div className="carousel-slide">
                                {isLoading && <p className="image-loading">Loading preview...</p>}
                                <img 
                                    src={currentImages[currentIndex]}
                                    alt={`Preview ${currentIndex + 1}`}
                                    className="preview-image"
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                    onLoadStart={() => setIsLoading(true)}
                                />
                                {hasError && (
                                    <p className="image-error">
                                        Couldn't load preview. Check the URL is correct and publicly accessible.
                                    </p>
                                )}
                            </div>
                            {currentImages.length > 1 && (
                                <button className="carousel-button next" onClick={nextImage}>
                                    &gt;
                                </button>
                            )}
                        </div>
                        {currentImages.length > 1 && (
                            <div className="carousel-indicators">
                                {currentImages.map((_, index) => (
                                    <span 
                                        key={index}
                                        className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(index)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

function ModeButton({mode, onToggle}) {
    if (mode === 'read')
        return(
            <button onClick={onToggle}>Edit</button>
        );
    else if (mode === 'edit')
        return(
            <>
                <button onClick={onToggle}>Read</button>
                <br />
            </>
        );
}

function PublishButton({ onPublish }) {
    return(
        <button onClick={onPublish}>Publish Changes</button>
    );
}
 
function PublishChanges() {
    const updates = {};
    let hasErrors = false;
    
    // Collect all updates
    for (const id of editableIds) {
        const element = document.getElementById(id);
        if (element) {
            let value = element.value || element.textContent;
            
            // Special handling for ImageUrls
            if (id === 'ImageUrls') {
                value = value.trim();
                if (value) {
                    // Process each URL
                    const urls = value.split(',')
                        .map(url => url.trim())
                        .filter(url => url)
                        .map(url => {
                            if (!url.startsWith('http')) {
                                url = 'https://' + url;
                            }
                            return url;
                        });
                    
                    // Basic URL validation
                    for (const url of urls) {
                        if (!url.match(/\.(jpeg|jpg|png|gif|webp)(\?.*)?$/i)) {
                            alert('Image URLs must end with .jpg, .jpeg, .png, .gif, or .webp');
                            hasErrors = true;
                            break;
                        }
                    }
                    
                    value = urls.join(', ');
                }
            }
            
            updates[id] = value;
        }
    }

    if (hasErrors) return;

    // Save to Firestore
    firebase.setDoc(profile, updates, { merge: true })
        .then(() => {
            console.log('Successfully saved:', updates);
            // Update local state without reloading
            if (updates.ImageUrls) {
                setImageUrls(updates.ImageUrls);
            }
            if (updates.donate) {
                setDonateLink(updates.donate);
            }
            setMode('read'); // Switch back to read mode
        })
        .catch((error) => {
            console.error('Error saving:', error);
            alert('Error saving changes. Please try again.');
        });
}

function Editable({ type, children, mode, id}) {
    const Type = type;
    const [text, setText] = useState(children);

    useEffect(() => {
        setText(children);
    }, [children]);

    useEffect(() => {
        loadProfile(profile).then((data) => {
            if (data[id]) setText(data[id]);
        });
    }, []);

    if (!editableIds.includes(id))
        editableIds.push(id);

    if (type === 'button') {
        if (mode === 'read') {
            return(
                <a href={text}>
                    <Type id={id} className='donate'>Donate</Type>
                </a>
            );
        }
        else if (mode === 'edit') {
            return(
                <>
                Donation Link:
                <textarea id={id} value={text} onChange={(e) => setText(e.target.value)}></textarea>
                <br/>
                </>
            );
        }
    }
    else {
        if (mode === 'read') {
            return(
                <Type id={id}>{text}</Type>
            );
        }
        else if (mode === 'edit') {
            return(
                <>
                <textarea id={id} value={text} onChange={(e) => setText(e.target.value)}></textarea>
                <br/>
                </>
            );
        }
    }
}

function DonateButton({mode, children}) {
    return(
        <>
        <Editable id='donate' mode={mode} type='button'>{children}</Editable>
        </>
    );
}

const headerRoot = ReactDOM.createRoot(document.getElementById('header'));
headerRoot.render(<Header />);

const mainRoot = ReactDOM.createRoot(document.getElementById('main'));
mainRoot.render(<Main mode='edit'/>);
})()